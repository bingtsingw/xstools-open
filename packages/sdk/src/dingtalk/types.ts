export namespace DingTalk {
  export namespace CustomRobots {
    export interface SendGroupMessages {
      accessToken: string;
      secret: string;
      message:
        | {
            msgtype: 'text';
            text: {
              content: string;
            };
          }
        | {
            msgtype: 'markdown';
            markdown: {
              title: string;
              text: string;
            };
          };
    }
  }
}
