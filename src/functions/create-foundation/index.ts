import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      httpApi: {
        method: "post",
        path: "/foundations",
      },
    },
  ],
};