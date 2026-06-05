import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page{
          background:#020617;
          color:white;
          min-height:100vh;
          font-family:'Poppins',sans-serif;
        }

      

        .brand{
          font-size:28px;
          font-weight:800;
          background:linear-gradient(90deg,#6366f1,#22d3ee);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .nav-link-custom{
          color:#cbd5e1 !important;
          margin-left:18px;
          font-weight:500;
        }

        .nav-link-custom:hover{
          color:#22d3ee !important;
        }

        /* HERO */
        .contact-hero{
          padding:100px 0 70px;
          text-align:center;
        }

        .contact-hero h1{
          font-size:3rem;
          font-weight:800;
        }

        .contact-hero span{
          color:#22d3ee;
        }

        .contact-hero p{
          max-width:650px;
          margin:15px auto 0;
          color:#cbd5e1;
          font-size:17px;
        }

        /* SECTION */
        .contact-section{
          padding-bottom:80px;
        }

        .contact-card{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:22px;
          padding:30px;
          backdrop-filter:blur(12px);
          color:white;
          height:100%;
        }

        .contact-card h3{
          margin-bottom:24px;
          font-weight:700;
        }

        /* FORM */
        .form-control{
          background:rgba(255,255,255,0.08) !important;
          border:1px solid rgba(255,255,255,0.10) !important;
          color:#fff !important;
          border-radius:14px;
          padding:14px 16px;
          margin-bottom:18px;
        }

        .form-control::placeholder{
          color:#cbd5e1 !important;
          opacity:1;
        }

        .form-control:focus{
          background:rgba(255,255,255,0.10) !important;
          color:#fff !important;
          box-shadow:none !important;
          border-color:#22d3ee !important;
        }

        .send-btn{
          width:100%;
          padding:14px;
          border:none;
          border-radius:30px;
          font-weight:700;
          background:linear-gradient(135deg,#6366f1,#22d3ee);
        }

        /* INFO */
        .info-item{
          display:flex;
          gap:16px;
          margin-bottom:24px;
        }

        .info-icon{
          width:48px;
          height:48px;
          border-radius:14px;
          background:rgba(34,211,238,0.12);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#22d3ee;
          font-size:20px;
        }

        .info-item h6{
          margin:0;
          font-weight:600;
        }

        .info-item p{
          margin:4px 0 0;
          color:#cbd5e1;
        }

        .social-links{
          display:flex;
          gap:12px;
          margin-top:20px;
        }

        .social-links a{
          width:42px;
          height:42px;
          border-radius:50%;
          background:rgba(255,255,255,0.06);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          text-decoration:none;
        }

        .social-links a:hover{
          background:#22d3ee;
          color:#020617;
        }

        /* FOOTER */
        .footer{
          text-align:center;
          padding:24px;
          border-top:1px solid rgba(255,255,255,0.06);
          color:#94a3b8;
        }

        @media(max-width:768px){
          .contact-hero h1{
            font-size:2.2rem;
          }

          .contact-card{
            padding:22px;
          }
        }
      `}</style>

      

      {/* HERO */}
      <section className="contact-hero">
        <Container>
          <h1>
            Contact <span>Us</span>
          </h1>
          <p>
            Have questions or need support? Send us your message and our team
            will get back to you soon.
          </p>
        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <Card className="contact-card">
                <h3>Send Message</h3>

                <Form onSubmit={handleSubmit}>
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <Form.Control
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button type="submit" className="send-btn">
                    Send Message
                  </Button>
                </Form>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="contact-card">
                <h3>Contact Information</h3>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <h6>Email</h6>
                    <p>support@skillbank.com</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <h6>Phone</h6>
                    <p>+91 9876543210</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <h6>Location</h6>
                    <p>Maharashtra, India</p>
                  </div>
                </div>

                <div className="social-links">
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="footer">
        © 2026 SkillBank • All rights reserved
      </footer>
    </div>
  );
}

export default Contact;