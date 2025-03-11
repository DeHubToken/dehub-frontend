import React from 'react'
import MessagesScreen from './main' 


type Props = {
  params: null;
  searchParams: {
    u?: string; 
  };
};

const page = (props: Props) => {
  return (
    <div>
      <MessagesScreen  searchParams={props?.searchParams}/> 
    </div>
  )
}

export default page