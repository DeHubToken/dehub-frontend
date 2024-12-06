import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { durations } from "@/configs";

const PlansTable = ({ data }: any) => {
  const fieldNames = [
    "S.No","Name", "Duration", "Tier",  "Chains", 
  ];

  return (
    <div className="overflow-auto max-h-[400px]"> {/* Add scroll to the container */}
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            {fieldNames.map((field, index) => (
              <TableHead key={index}>{field}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto max-h-[300px]"> {/* Add scroll to the table body */}
          {data.map((row: any, index: number) => (
            <TableRow key={index}>  
              <TableCell>{index+1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{durations[row.duration].title}</TableCell>
              <TableCell>{row.tier}</TableCell>
              <TableCell>
                {row.chains.map((chain: any, index: number) => (
                  <div key={index}>
                    <strong>Chain ID:</strong> {chain.chainId} <br />
                    <strong>Token:</strong> {chain.token} <br />
                    <strong>Price:</strong> {chain.price} <br />
                    <strong>Is Published:</strong> {chain.isPublished.toString()} <br />
                    <strong>Is Active:</strong> {chain.isActive.toString()}
                  </div>
                ))}
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlansTable;
