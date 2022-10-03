/* eslint-disable react-hooks/exhaustive-deps */
import { TextArea, GetStateResponse } from "@deskpro/app-sdk";
import { Stack, Button, H1, useDeskproAppClient } from "@deskpro/app-sdk";
import { useState, useEffect } from "react";

import useDebounce from "../utils/debounce";

export const Main = () => {
  const { client } = useDeskproAppClient();

  const [text, setText] = useState<string>("");
  const debouncedText = useDebounce(text, 200);

  useEffect(() => {
    client?.setState<string>("scratchpad", debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    client
      ?.getState<string>("scratchpad")
      .then((res: GetStateResponse<string>[]) => setText(res[0]?.data ?? ""));
  }, [client]);

  const deleteText = () => {
    client?.setState<string>("scratchpad", "");
    setText("");
  };

  return (
    <Stack gap={10} vertical>
      <TextArea
        variant="inline"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter stuff.."
        style={{
          resize: "none",
          minHeight: "10em",
          maxHeight: "100%",
          height: "auto",
        }}
      />
      <Stack align="center" style={{ width: "100%" }} justify={"space-between"}>
        <Button
          onClick={deleteText}
          style={{
            backgroundColor: "transparent",
            color: "#1c3e55",
            padding: "20px 48px 20px 48px",
          }}
          size="large"
          text="Clear"
        ></Button>
        {debouncedText === text ? <H1>Saved</H1> : <H1>Saving...</H1>}
      </Stack>
    </Stack>
  );
};
