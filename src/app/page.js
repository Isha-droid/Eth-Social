"use client"
import Image from "next/image";
import { ChatAppContext} from "../../Context/ChatAppContext";
import { Navbar } from "../../Components";
import React, { useContext } from 'react';


export default function Home() {
  const {title}= useContext(ChatAppContext);
  return (
    <>
 <div>{title}</div>
    </>
  );
}
