import Box from "@mui/material/Box";

const Contact = () => {
  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        {/* <Box> */}
        {/*   <Typography fontWeight={700} variant={"h5"} gutterBottom> */}
        {/*     Interested in working with us? */}
        {/*   </Typography> */}
        {/*   <Typography>Hit us up and we'll get in touch with you.</Typography> */}
        {/* </Box> */}
      </Box>
    </Box>
  );
};

export default Contact;
