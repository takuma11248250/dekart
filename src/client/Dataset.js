import Button from 'antd/es/button'
import styles from './Dataset.module.css'
import { useDispatch, useSelector } from 'react-redux'
import Query from './Query'

function DatasetSelector({ dataset }) {
    return <div className={styles.datasetSelector}>
        <div className={styles.selector}>
            <div className={styles.selectorButtons}>
                <Button block>Athena query</Button>
                <Button block>Upload file</Button>
            </div>
        </div>
        <div className={styles.status}>Select data source</div>
    </div>
}

export default function Dataset({ dataset }) {
    let query = null
    const queries = useSelector(state => state.queries)
    if (dataset.queryId) {
        query = queries.find(q => q.id === dataset.queryId)
    }
    return <>
        {query ? <Query query={query} /> : <DatasetSelector dataset={dataset} />}
    </>
}