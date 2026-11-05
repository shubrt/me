/** The module context: the part of the Email Service binding this worker uses. */
export type Context = {
  EMAIL: {
    send(message: {
      to: string;
      from: string;
      subject: string;
      text: string;
      replyTo: string;
    }): Promise<unknown>;
  };
};
