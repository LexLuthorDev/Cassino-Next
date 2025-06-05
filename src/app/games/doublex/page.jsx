"use client";

import { useState, useRef, useEffect } from "react";

import DoubleGame from "@/components/DoubleGame";
export default function PageHome() {
    return (
    <div className="min-h-full h-screen min-w-sm flex flex-col text-white justify-center">
      {/* Cabeçalho */}
      <DoubleGame token_jogador="token-teste" />
    </div>
  );
}