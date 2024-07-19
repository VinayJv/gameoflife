/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import "./globals.css";

const rows = 30;
const columns = 30;
const width = 600;
const height = 600;
const pixelSize = 20;

type Board = number[][];

const colors = ["black", "yellow"];

function createBoardArray(): Board {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
}

export default function Home() {
  const [toggle, setToggle] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardArray = createBoardArray();

  const [boardState, setBoardState] = useState<Board>(boardArray);

  useEffect(()=>{
    if(!toggle){
      return
    }
    const interval = setInterval(updateBoard, 100);
    return () => clearInterval(interval);
  },[toggle, updateBoard]);

  useEffect(()=>{
    if(canvasRef.current){
      const context = canvasRef.current.getContext("2d");

      // clearing board on each run
      if(!context) return;
      context?.clearRect(0, 0, width, height);
      context.strokeStyle = "gray";
      context.lineWidth = 0.1;

      //filling the canvas
      for(let r = 0; r < rows; ++r){
        for(let c = 0; c < columns; ++c){
          context.fillStyle = colors[boardState[r][c]];

          context.fillRect(Math.floor(width / rows * r), Math.floor(height / columns * c), pixelSize, pixelSize);
          context.strokeRect(Math.floor(width / rows * r), Math.floor(height / columns * c), pixelSize, pixelSize);
        }
      }
    }
  }, [boardState]);

  function updateBoard(){
    setBoardState((prevBoardState) => {
      let newBoard = prevBoardState.map((r)=> [...r]);

      for(let r = 0; r < rows ; ++r){
        for(let c = 0; c < columns ; ++c){

          const aliveCellsCount = checkNeighbours(r, c);

          if(prevBoardState[r][c] === 0){
            if(aliveCellsCount === 3){
              newBoard[r][c] = 1;
            }
          } else {
            if(aliveCellsCount !== 2 && aliveCellsCount !==3){
              newBoard[r][c] = 0;
            }
          }
        }
      }
      return newBoard;
    })
  }

  function checkNeighbours(ri: number, ci: number){
    let count = 0;
    for(let neighbourRow = -1; neighbourRow <= 1;  ++neighbourRow){
      for(let neighbourColumn = -1; neighbourColumn <=1; ++neighbourColumn){
        if(neighbourRow != 0 || neighbourColumn != 0){

          const r = (ri + neighbourRow + rows) % rows;
          const c = (ci + neighbourColumn + columns ) % columns;


          if(boardState[r][c] == 1){
            ++count;
          }
        } 
      }
    }
    return count;
  }

  return (
    <div className={styles.main}>
      <h1>Conway&apos;s Game of Life</h1>
      <canvas width={width} height={height} ref={canvasRef} onClick={(e)=>{

        const x = Math.floor(e.nativeEvent.offsetX / pixelSize);
        const y = Math.floor(e.nativeEvent.offsetY / pixelSize);

        const updatedBoard = [...boardState];

        if(updatedBoard[x][y] == 0){
          updatedBoard[x][y] = 1;
        } else {
          updatedBoard[x][y] = 0;
        }      

        setBoardState(updatedBoard);
      }} className={styles.canvas}>

      </canvas >
      <div>
        <button onClick={updateBoard}>Next</button>
        <button onClick={() => setToggle(!toggle)}>{toggle ? "Pause" : "Play"}</button>
        <button onClick={()=>setBoardState(createBoardArray())}>Reset</button>
      </div>
    </div>
  );
}
