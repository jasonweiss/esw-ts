import React, { useState } from 'react'
import IOOperationComponent from './IOOperationComponent'

function ListConfig(props: ListConfigProps) {
  const [response, setResponse] = useState('')

  const listConfig = async () => {
    const response = await window.fetch(`${props.configURL}list`)
    if (response.status === 200) {
      const a = await response.json()
      setResponse(JSON.stringify(a))
    }
  }

  return (
    <IOOperationComponent
      txtId='list-config'
      btnId='list-config'
      componentNameProp='List Config'
      operation='List'
      output={response}
      api={listConfig}
      token={() => ''}
    />
  )
}
interface ListConfigProps {
  configURL: string
}
export default ListConfig