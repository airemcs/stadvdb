'use client'
import EditPage from "@/app/components/EditPage";
import React from "react";

export default function Edit({params}) {
  const appId = React.use(params)
  return (
  <>
    <EditPage appId={appId.id}/>
  </>
  );
}
