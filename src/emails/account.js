import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "jaiminjagdish@gmail.com",
    subject: "Welcome onboard. Thanks for signing up.",
    text: `Hey ${name}. We're glad you signed up to ITask App. We hope our app would help you enhance the productivity on a daily basis.`,
  });
};

export const sendDeleteMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "jaiminjagdish@gmail.com",
    subject: "We'll miss you🥺.",
    text: `Hey ${name}. It's sad to see you go. We're sorry for not meeting your expectations this time around.`,
  });
};
