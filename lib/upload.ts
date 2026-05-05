export const uploadImage = async (image: string) => {
  const form = new FormData();

  form.append("image", image.split(",").pop()!);

  const res = await fetch(
    `${process.env.IMGBB_URL}?key=${process.env.IMGBB_KEY}`,
    {
      method: "POST",
      body: form,
    },
  );
  console.log("res:", res);

  if (!res.ok) return { error: "Failed to upload image" };

  const url: string = (await res.json()).data?.url;

  return { url };
};
