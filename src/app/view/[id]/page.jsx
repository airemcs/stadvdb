'use client'
import { useEffect, useState } from "react";
import ViewPage from "@/app/components/ViewPage";
import React from "react";
export default function View({params}) {
  const params2 = React.use(params)
  console.log(params2)
  return (
    <>
      <ViewPage 
        AppID={params2}
      />
    </>
  );
}