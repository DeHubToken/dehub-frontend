import React from 'react'
// import  {use} from 'next/navigation'
type Props = {}
import { redirect } from 'next/navigation'
const page = (props: Props) => {
    redirect("/")
  return (
    <div>Not found</div>
  )
}

export default page