/* eslint-disable react-hooks/exhaustive-deps */
import { TextArea, GetStateResponse } from "@deskpro/app-sdk";
import {
  Stack,
  Button,
  H1,
  useInitialisedDeskproAppClient,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";

import useDebounce from "../utils/debounce";

export const Main = () => {
  const { client } = useDeskproAppClient();

  const [text, setText] = useState<string>("");
  const [ranFirstTime, setRanFirstTime] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const debouncedText = useDebounce(text, 700);

  useInitialisedDeskproAppClient((client) => {
    client
      .getUserState<string>("scratchpad")
      .then((res: GetStateResponse<string>[]) => {
        setText(res[0]?.data ?? "");
        setRanFirstTime(true);
      });
  });

  useInitialisedDeskproAppClient(
    (client) => {
      if (ranFirstTime) {
        setSaveStatus("Saving");
        client.setUserState<string>("scratchpad", debouncedText);
        setSaveStatus("Saved");
      }
    },
    [debouncedText]
  );

  const deleteText = () => {
    client?.setUserState<string>("scratchpad", "");
    setText("");
  };

  return (
    <Stack gap={10} vertical>
      <TextArea
        variant="inline"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        style={{
          resize: "none",
          minHeight: "10em",
          maxHeight: "100%",
          height: "auto",
          border: "none",
        }}
      />
      <div
        style={{
          content: " ",
          display: "block",
          borderBottom: "0.5px solid #D3D6D7",
          width: "110%",
          marginLeft: "-5%",
        }}
      ></div>
      <Stack align="center" style={{ width: "100%" }} justify={"space-between"}>
        <Button
          onClick={deleteText}
          style={{
            backgroundColor: "transparent",
            color: "#1c3e55",
            padding: "4px 8px 4px 8px",
            marginLeft: "3px",
          }}
          size="large"
          text="Clear"
        ></Button>
        {debouncedText === text ? (
          <H1>{saveStatus}</H1>
        ) : (
          <H1>User is typing...</H1>
        )}
      </Stack>
    </Stack>
  );
};
