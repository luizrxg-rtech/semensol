import {forwardRef, ReactElement} from "react";
import {Icon, IconWeight, ScalesIcon} from "@phosphor-icons/react";

const weights = new Map<IconWeight, ReactElement>([
  [
    "bold",
    <path d="M264-216h432l-49-360H313l-49 360Zm216-432q20.4 0 34.2-13.8Q528-675.6 528-696q0-20.4-13.8-34.2Q500.4-744 480-744q-20.4 0-34.2 13.8Q432-716.4 432-696q0 20.4 13.8 34.2Q459.6-648 480-648Zm110 0h57q27.16 0 47.08 17.5Q714-613 718-586l49 360q5 32.44-16.39 57.22Q729.23-144 695.95-144H264.28q-33.28 0-54.78-24.78T193-226l49-360q4-27 23.92-44.5T313-648h57q-5-11-7.5-23t-2.5-25q0-50 35-85t85-35q50 0 85 35t35 85q0 13-2.5 25t-7.5 23ZM264-216h432-432Z"/>
  ],
  [
    "fill",
    <path d="M480-648q20.4 0 34.2-13.8Q528-675.6 528-696q0-20.4-13.8-34.2Q500.4-744 480-744q-20.4 0-34.2 13.8Q432-716.4 432-696q0 20.4 13.8 34.2Q459.6-648 480-648Zm110 0h57q27.16 0 47.08 17.5Q714-613 718-586l49 360q5 32.44-16.39 57.22Q729.23-144 695.95-144H264.28q-33.28 0-54.78-24.78T193-226l49-360q4-27 23.92-44.5T313-648h57q-5-11-7.5-23t-2.5-25q0-50 35-85t85-35q50 0 85 35t35 85q0 13-2.5 25t-7.5 23Z"/>
  ],
]);

const WeightIcon: Icon = forwardRef((props, ref) => (
  <ScalesIcon ref={ref} {...props} />
));

WeightIcon.displayName = "WeightIcon";

export default WeightIcon;