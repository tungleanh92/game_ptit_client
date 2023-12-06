import Box, { BoxProps } from "@mui/material/Box";

const LoadingIcon = ({ sx, width, height, ...props }: BoxProps) => {
  return (
    <Box
      sx={{
        minWidth: "1rem",
        minHeight: "1rem",
        width,
        height,
        maxWidth: width,
        maxHeight: height,
        border: "2px solid currentColor",
        borderRadius: "50%",
        borderRightColor: "transparent",
        animation: "spinner-border .75s linear infinite",
        ...sx,
        "@keyframes spinner-border": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      }}
      {...props}
    />
  );
};

export default LoadingIcon;
