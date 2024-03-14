/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Button, H1, TextArea } from "@deskpro/deskpro-ui";
import {
  GetStateResponse,
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
  const { debouncedValue, setDebouncedValue } = useDebounce(text, 500);

  useInitialisedDeskproAppClient((client) => {
    client
      .getUserState<string>("scratchpad")
      .then((res: GetStateResponse<string>[]) => {
        setText(res[0]?.data ?? "");
        setDebouncedValue(res[0]?.data ?? "");
        setRanFirstTime(true);
      });
  });

  useInitialisedDeskproAppClient(
    (client) => {
      if (ranFirstTime) {
        setSaveStatus("Saving");
        client.setUserState<string>("scratchpad", debouncedValue);
        setSaveStatus("Saved");
      }
    },
    [debouncedValue]
  );

  const deleteText = () => {
    client?.setUserState<string>("scratchpad", "");

    setText("");
  };

  return (
    <Stack gap={10} vertical>
      {ranFirstTime && (
        <TextArea
          variant="inline"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          style={{
            resize: "none",
            minHeight: "10em",
            maxHeight: "100%",
            height: !text ? "10em" : "auto",
            width: "100%",
            border: "none",
            overflow: "hidden",
          }}
        />
      )}

      <div style={{ width: "100%" }}>
        <div
          style={{
            content: " ",
            display: "block",
            borderBottom: "0.5px solid #D3D6D7",
            width: "110%",
            marginLeft: "-5%",
          }}
        ></div>
        <Stack
          align="center"
          style={{ width: "100%", marginTop: "10px" }}
          justify={"space-between"}
        >
          <Button
            onClick={deleteText}
            style={{
              boxShadow: "none",
              border: "1px solid #D3D6D7",
              backgroundColor: "transparent",
              color: "#000000",
              padding: "7px 24px 7px 24px",
              marginLeft: "3px",
            }}
            size="large"
            text="Clear"
          ></Button>
          {debouncedValue === text ? (
            <H1 style={{ color: "#8B9293" }}>{saveStatus}</H1>
          ) : (
            <H1 style={{ color: "#8B9293" }}>Typing...</H1>
          )}
        </Stack>
      </div>
    </Stack>
  );
};
