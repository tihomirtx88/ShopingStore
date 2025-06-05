import React from "react";
import { Button } from "../ui/button";

export default function AddtoCart({productId}:{productId: string}) {

  
  return <Button className="capitalize mt-8 bg-blue-500 hover:bg-blue-100 cursor-pointer" size='lg'>
    Add To Cart
  </Button>
}
