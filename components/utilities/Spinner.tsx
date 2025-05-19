import { createSpinner, showSpinner } from "@syncfusion/ej2-react-popups";
import { useEffect, useId } from "react";

export function Spinner({
  backgroundColor = "rgba(0, 0, 0, 0.1)",
  height = "100%",
  id,
  left = 0,
  position = "relative",
  top = 0,
  width = "100%",
}: {
  backgroundColor?: string;
  height?: string;
  id?: string;
  left?: number | string;
  position?: "absolute" | "fixed" | "relative";
  top?: number | string;
  width?: string;
}) {
  const reactId = useId();
  const spinnerId = id ?? reactId;

  useEffect(() => {
    createSpinner({
      target: document.getElementById(`spinner_${spinnerId}`)!,
    });
    showSpinner(document.getElementById(`spinner_${spinnerId}`)!);
  }, [spinnerId]);

  return (
    <div
      className="z-10"
      style={{
        backgroundColor,
        height,
        left,
        position,
        top,
        width,
      }}
    >
      <div id={`spinner_${spinnerId}`}></div>
    </div>
  );
}
