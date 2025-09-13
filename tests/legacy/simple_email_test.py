import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Credentials
smtp_server = "smtp.office365.com"
smtp_port = 587
username = "support@movedin.com"
password = "gagxov-syxkek-8byvDu"

print("Testing GoDaddy 365 email...")

try:
    # Create message
    msg = MIMEMultipart()
    msg['From'] = username
    msg['To'] = username
    msg['Subject'] = "MovedIn 2.0 Test Email"
    
    body = "This is a test email from MovedIn 2.0 using GoDaddy 365 email."
    msg.attach(MIMEText(body, 'plain'))
    
    # Send email
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(username, password)
    server.send_message(msg)
    server.quit()
    
    print("✅ Email sent successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
