'use client'

import React, { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PropertyDetail from "@/components/Property/PropertyDetail"


export default function PropertyDetailPage() {
    return (
    <>
      <Header />
      <div className="pt-24 lg:pt-16">
        <PropertyDetail/>
      </div>
      <Footer />
    </>
  )
}