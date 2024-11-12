/* eslint-disable react-hooks/exhaustive-deps */
import { GetStateResponse, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {
  useInitialisedDeskproAppClient,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useDebounce from "../utils/debounce";
import { Button, H1, Scrollbar, Stack } from "@deskpro/deskpro-ui";
import { FormattedMessage } from 'react-intl';

export const Main = () => {
  const { client } = useDeskproAppClient();
  const [text, setText] = useState<string>("");
  const [ranFirstTime, setRanFirstTime] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
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
        setSaveStatus("saving");
        client.setUserState<string>("scratchpad", debouncedValue);
        setSaveStatus("saved");
      }
    },
    [debouncedValue]
  );

  const deleteText = () => {
    client?.setUserState<string>("scratchpad", "");

    setText("");
  };

  return (
    <Stack gap={10} vertical style={{ height: '100%', width: '100%' }}>
      {ranFirstTime && (
        <Scrollbar style={{ height: '100%', width: '100%' }}>
          <ReactQuill
            style={{ border: "0px", height: "100%", width: "100%" }}
            theme="snow"
            value={text}
            onChange={setText}
          />
        </Scrollbar>
      )}

      <footer style={{ width: "100%", marginTop: "10px" }}>
        <div
          style={{
            content: " ",
            display: "block",
            borderBottom: "0.5px solid #D3D6D7",
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
            text={<FormattedMessage id="button.clear" />}
          />
          <H1 style={{ color: "#8B9293" }}>
            <FormattedMessage id={debouncedValue === text ? `state.${saveStatus}` : "state.typing"} />
          </H1>
        </Stack>
      </footer>
    </Stack>
  );
};
