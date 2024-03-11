export const GetBrandImage = (brandName: string) => {
  const url = "https://api.brandfetch.io/v2/brands/brandfetch.com";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer Mb6B7uMSAN2KCw3OZysHSZYhjJ7TuSK0Dh/o6WkMm3w=",
    },
  };

  let r = "";

  void fetch(url, options)
    .then((res) => res.text())
    .then((res) => (r = res))
    .catch((err) => console.error("error:" + err));

  console.log("testasdt: " + r);
};
