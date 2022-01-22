import { forwardRef, ReactElement, Ref } from "react";
import { Slide } from "@mui/material";
import { TransitionProps as MuiTransitionProps } from "@mui/material/transitions";

interface TransitionProps extends MuiTransitionProps {
  children: ReactElement;
}

const Transition = forwardRef((props: TransitionProps, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default Transition;
export type { TransitionProps };
