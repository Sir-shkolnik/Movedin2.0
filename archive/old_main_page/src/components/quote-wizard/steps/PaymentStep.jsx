import React from "react";

function PaymentStep() {
  return (
    <>
        <h2 className="qw-title">Payment</h2>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{textAlign:'center', color:'#627193'}}>Payment form/redirect will appear here (Stripe). We will use live API, no mock data.</p>
        </div>
    </>
  );
}

export default PaymentStep;


