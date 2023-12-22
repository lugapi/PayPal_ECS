// Create the JSON files
const json = {
  intent: "CAPTURE",
  purchase_units: [
    {
      amount: {
        currency_code: currency,
        value: "254.99",
        breakdown: {
          item_total: {
            currency_code: currency,
            value: "250.00",
          },
          shipping: {
            currency_code: currency,
            value: "4.99",
          },
        },
      },
      invoice_id: `invoice_${Date.now()}`,
      items: [
        {
          name: "Nike Air Max 2019",
          description: "36EU - 4US",
          unit_amount: {
            currency_code: currency,
            value: "150.00",
          },
          quantity: "1",
        },
        {
          name: "Nike Pegasus 40",
          description: "36EU",
          unit_amount: {
            currency_code: currency,
            value: "100",
          },
          quantity: "1",
        },
      ],
    },
  ],
};

  paypal
    .Buttons({
      style: [
        {
          layout: "vertical",
          color: "blue",
          shape: "pill",
          label: "paypal",
        },
      ],
      createOrder: function (data, actions) {
        return fetch("/api/orders", {
          method: "post",
          body: JSON.stringify({
              contentBody: json,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (orderData) {
            console.log(orderData);
            if (orderData.name) {
              document.querySelector("#response").innerHTML += prettyPrintObject(orderData);
              document.querySelector("#response").classList.remove("hidden");
            }
            console.log(orderData.id);
            return orderData.id;
          });
      },
      async onApprove(data, actions) {
        console.log("dataOnApprove", data);
        try {
          const response = await fetch(`/api/orders/${data.orderID}/capture`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`
            );
          } else if (!orderData.purchase_units) {
            throw new Error(JSON.stringify(orderData));
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            // resultMessage(
            //   `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`
            // );
            console.log(
              "Capture result",
              orderData,
              JSON.stringify(orderData, null, 2)
            );
            // resultMessage(prettyPrintObject(orderData));
            console.log(orderData);
            //SAVE IN COOKIE
            document.cookie = "payerInfo=" + JSON.stringify(orderData);
            //REDIRECTION
            document.location.href = "./registration";

          }
        } catch (error) {
          console.error(error);
          // resultMessage(
          //   `Sorry, your transaction could not be processed...<br><br>${error}`
          // );
        }
      },
      onError(err) {
        console.log("ERROR OCCURED", err);
      },
      onCancel(data) {
        console.log("CANCELED", data);
      },
    })
    .render("#paypal-button-container");
// }

function resultMessage(message) {
  const container = document.querySelector("#response");
  document.querySelector("#response").classList.remove('hidden');
  container.innerHTML = message;
}