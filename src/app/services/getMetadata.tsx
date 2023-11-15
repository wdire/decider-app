import axios from "axios";

const getMetadata = async (url: string) => {
  return await axios.post("/api/get-metadata", {
    url: url,
  });
};

export default getMetadata;
