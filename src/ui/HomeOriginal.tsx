import React from "react";
import HomePage from "./HomePage";

type HomeOriginalProps = {
  onNavigateToCalculator: () => void;
  onNavigateToReset: () => void;
  calculatorHref: string;
  resetHref: string;
  onWhatsappClick: (label: string) => void;
  isWhatsappCta: (label: string) => boolean;
  getWhatsappHref: (label: string) => string;
};

const HomeOriginal: React.FC<HomeOriginalProps> = (props) => (
  <HomePage variant="default" {...props} />
);

export default HomeOriginal;
