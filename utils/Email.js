import React from 'react'

export default function Email() {
  return (
    <html>
    <head>
      <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
      <meta name="description" content="Reset Password Email Template." />
      <style>
        {`
          a:hover { text-decoration: underline !important; }
        `}
      </style>
    </head>
    <body style={{ margin: '0px', backgroundColor: '#f2f3f8' }}>
      {/* 100% body table */}
      <table
        cellSpacing="0"
        border="0"
        cellPadding="0"
        width="100%"
        bgcolor="#f2f3f8"
        style={{
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        <tr>
          <td>
            <table
              style={{
                backgroundColor: '#f2f3f8',
                maxWidth: '670px',
                margin: '0 auto',
              }}
              width="100%"
              border="0"
              align="center"
              cellPadding="0"
              cellSpacing="0"
            >
              <tr>
                <td style={{ height: '80px' }}>&nbsp;</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <a href="https://rakeshmandal.com" title="logo" target="_blank">
                    <img width="60" src="https://food-fp.netlify.app/logo.png" title="logo" alt="logo" />
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ height: '20px' }}>&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table
                    width="95%"
                    border="0"
                    align="center"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      maxWidth: '670px',
                      backgroundColor: '#fff',
                      borderRadius: '3px',
                      textAlign: 'center',
                      boxShadow: '0 6px 18px 0 rgba(0,0,0,.06)',
                    }}
                  >
                    <tr>
                      <td style={{ height: '40px' }}>&nbsp;</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0 35px' }}>
                        <h1 style={{ color: '#1e1e2d', fontWeight: 500, margin: '0', fontSize: '32px', fontFamily: 'Rubik, sans-serif' }}>
                          You have requested to reset your password
                        </h1>
                        <span
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            margin: '29px 0 26px',
                            borderBottom: '1px solid #cecece',
                            width: '100px',
                          }}
                        />
                        <p style={{ color: '#455056', fontSize: '15px', lineHeight: '24px', margin: '0' }}>
                          We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.
                        </p>
                        <a
                          href="javascript:void(0);"
                          style={{
                            background: '#20e277',
                            textDecoration: 'none',
                            fontWeight: '500',
                            marginTop: '35px',
                            color: '#fff',
                            textTransform: 'uppercase',
                            fontSize: '14px',
                            padding: '10px 24px',
                            display: 'inline-block',
                            borderRadius: '50px',
                          }}
                        >
                          Reset Password
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '40px' }}>&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ height: '20px' }}>&nbsp;</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(69, 80, 86, 0.7411764705882353)', lineHeight: '18px', margin: '0 0 0' }}>
                    &copy; <strong>www.rakeshmandal.com</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ height: '80px' }}>&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      {/* /100% body table */}
    </body>
  </html>
  )
}
