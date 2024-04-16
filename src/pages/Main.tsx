/* eslint-disable react-hooks/exhaustive-deps */
import { GetStateResponse } from "@deskpro/app-sdk";
import {
  useInitialisedDeskproAppClient,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useDebounce from "../utils/debounce";
import { Button, H1, Stack } from "@deskpro/deskpro-ui";

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

    client.setHeight(420);
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
        <ReactQuill
          style={{ height: "300px", border: "0px", marginLeft: "4px" }}
          theme="snow"
          value={text}
          onChange={setText}
        />
      )}

      <div style={{ width: "100%", marginTop: "50px" }}>
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
