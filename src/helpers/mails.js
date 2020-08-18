import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

const composeRegisterMail = (firstname) => {
  return `
  <h2>Welcome to SendIT Logistics</h2>
  Hi there ${firstname},
  <br/>
  Thank you for registering! on SendIT
  <br/><br/>
  <div style="font-family: inherit">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus.</p>
    </div>
    `;
};

const composeDeliveryMail = (parcelId) => {
  return `
    <h2>SendIT Parcel Delivery Mail</h2>
    Hi there,
    <br/>
    <p>Your package with parcel id ${parcelId} on SendIT
    has been delivered </p>
    <br/><br/>
    <div style="font-family: inherit">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus.</p>
      </div>
      `;
};

export const confirmEmail = (email, firstname) => {
  const mail = {
    to: email,
    from: "kareemmajid86@gmail.com",
    subject: "Welcome to SendIT",
    html: composeRegisterMail(firstname),
  };
  sgMail.send(mail);
  //   console.log(JSON.stringify(mail));
};

export const deliveryEmail = (email, parcelId) => {
  const mail = {
    to: email,
    from: "kareemmajid86@gmail.com",
    subject: "Parcel Delivery Status",
    html: composeDeliveryMail(parcelId),
  };
  sgMail.send(mail);
  //   console.log(JSON.stringify(mail));
};
