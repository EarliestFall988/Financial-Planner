import { PropagateLoader, PulseLoader } from "react-spinners";
import { type CSSProperties } from "react";

const cssSpinnerOverride: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export const PropagateSpinner = () => {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="pb-2">
        <PropagateLoader
          color={"white"}
          loading={true}
          cssOverride={cssSpinnerOverride}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export const PulseSpinner: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="pb-2">
        <PulseLoader
          color={"#0ea5e9"}
          loading={true}
          cssOverride={cssSpinnerOverride}
          size={size ?? 20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};
