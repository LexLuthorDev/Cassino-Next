"use client";

import { useState, useRef, useEffect } from "react";

import MinesGame from "../../../components/MinesGame";
export default function PageMines() {
    return (
    <div className="min-h-full h-screen min-w-sm flex flex-col text-white justify-center">
      {/* Cabeçalho */}
      <MinesGame token_jogador="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo2LCJ0aXBvIjo0LCJpYXQiOjE3NDc4NzkxMjcsImV4cCI6MTc0Nzk2NTUyN30.WE-x1YVplGM3A3-k_5iLBtWwgV1uOx08u9hrSJ-ULtw" />
    </div>
  );
}