import { CancelQueryRequest, CreateQueryRequest, RunQueryRequest } from '../../proto/dekart_pb'
import { Dekart } from '../../proto/dekart_pb_service'
import { get } from '../lib/api'
import { grpcCall } from './grpc'
import { setError } from './message'

export function queryChanged (queryId, queryText) {
  return (dispatch, getState) => {
    const query = getState().queries.find(q => q.id === queryId)
    const changed = query ? query.queryText !== queryText : true
    dispatch({ type: queryChanged.name, queryText, queryId, changed })
  }
}

export function createQuery (datasetId) {
  return (dispatch, store) => {
    const { selectedSourceID } = store().connection
    dispatch({ type: createQuery.name })
    const request = new CreateQueryRequest()
    request.setDatasetId(datasetId)
    request.setSourceId(selectedSourceID)
    dispatch(grpcCall(Dekart.CreateQuery, request))
  }
}

export function runQuery (queryId, queryText) {
  return async (dispatch) => {
    dispatch({ type: runQuery.name, queryId })
    const request = new RunQueryRequest()
    request.setQueryId(queryId)
    request.setQueryText(queryText)
    dispatch(grpcCall(Dekart.RunQuery, request))
  }
}

export function cancelQuery (queryId) {
  return async (dispatch) => {
    dispatch({ type: cancelQuery.name, queryId })
    const request = new CancelQueryRequest()
    request.setQueryId(queryId)
    dispatch(grpcCall(Dekart.CancelQuery, request))
  }
}

export function querySource (queryId, querySourceId, queryText) {
  return { type: querySource.name, queryText, querySourceId, queryId }
}

export function downloadQuerySource (query) {
  return async (dispatch, getState) => {
    dispatch({ type: downloadQuerySource.name, query })
    const { queries, token } = getState()
    const i = queries.findIndex(q => q.id === query.id)
    if (i < 0) {
      return
    }
    try {
      const res = await get(`/query-source/${query.sourceId || 'default'}/${query.querySourceId}.sql`, token)
      const queryText = await res.text()
      dispatch(querySource(query.id, query.querySourceId, queryText))
    } catch (err) {
      dispatch(setError(err))
    }
  }
}
