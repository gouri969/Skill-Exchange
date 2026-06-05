import React from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <style>{`
        .home-page{
          background:#020617;
          color:white;
          font-family:'Poppins',sans-serif;
          overflow-x:hidden;
        }

        /* NAVBAR */
        .navbar-custom{
          background:rgba(255,255,255,0.05);
          backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(255,255,255,0.08);
          padding:14px 0;
        }

        .brand{
          font-size:30px;
          font-weight:800;
          background:linear-gradient(90deg,#6366f1,#22d3ee);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .nav-link-custom{
          color:#cbd5e1 !important;
          margin-left:20px;
          font-weight:500;
          transition:.3s;
        }

        .nav-link-custom:hover{
          color:#22d3ee !important;
        }

        .join-btn{
          background:linear-gradient(135deg,#6366f1,#22d3ee);
          border:none;
          color:#fff;
          padding:10px 24px;
          border-radius:30px;
          font-weight:600;
          margin-left:20px;
        }

        /* HERO */
        .hero{
          min-height:100vh;
          display:flex;
          align-items:center;
          background:
            linear-gradient(rgba(2,6,23,.75),rgba(2,6,23,.8)),
            url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f");
          background-size:cover;
          background-position:center;
        }

        .hero h1{
          font-size:4rem;
          font-weight:800;
          line-height:1.2;
        }

        .hero span{
          color:#22d3ee;
        }

        .hero p{
          color:#cbd5e1;
          font-size:18px;
          margin:20px 0;
          max-width:600px;
        }

        .hero-btn{
          background:linear-gradient(135deg,#6366f1,#22d3ee);
          border:none;
          padding:14px 28px;
          border-radius:35px;
          font-weight:700;
        }

        /* SECTION */
        .section{
          padding:90px 0;
        }

        .section-title{
          text-align:center;
          font-size:2.6rem;
          font-weight:700;
          margin-bottom:50px;
        }

        /* CARD */
        .feature-card{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:24px;
          padding:28px;
          color:white;
          text-align:center;
          backdrop-filter:blur(10px);
          transition:.3s;
          height:100%;
        }

        .feature-card:hover{
          transform:translateY(-8px);
          border-color:#22d3ee;
        }

        .feature-icon{
          font-size:38px;
          color:#22d3ee;
          margin-bottom:16px;
        }

        /* ABOUT */
        .about-section{
          background:
            linear-gradient(rgba(15,23,42,.82),rgba(15,23,42,.82)),
            url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d");
          background-size:cover;
          background-position:center;
        }

        /* FOOTER */
        .footer{
          background:#010814;
          padding:70px 0 20px;
        }

        .footer h5{
          color:#22d3ee;
          margin-bottom:20px;
          font-weight:700;
        }

        .footer p{
          color:#94a3b8;
        }

        .footer a{
          display:block;
          color:#cbd5e1;
          text-decoration:none;
          margin-bottom:10px;
          transition:.3s;
        }

        .footer a:hover{
          color:#22d3ee;
          padding-left:4px;
        }

        .social-icons i{
          margin-right:12px;
          font-size:20px;
        }

        .footer-bottom{
          margin-top:35px;
          border-top:1px solid rgba(255,255,255,0.08);
          padding-top:20px;
          text-align:center;
          color:#64748b;
        }

        @media(max-width:768px){
          .hero h1{
            font-size:2.5rem;
          }

          .join-btn{
            margin-left:0;
            margin-top:10px;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar expand="lg" className="navbar-custom sticky-top">
        <Container>
          <Navbar.Brand className="brand">SkillBank</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
  Home
</Nav.Link>

<Nav.Link as={Link} to="/about" className="nav-link-custom">
  About
</Nav.Link>

<Nav.Link as={Link} to="/contact" className="nav-link-custom">
  Contact
</Nav.Link>

<Nav.Link as={Link} to="/review" className="nav-link-custom">
  Review
</Nav.Link>


<Button as={Link} to="/register" className="join-btn">
  Join Free
</Button>


            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO */}
      <section className="hero">
        <Container>
          <Row>
            <Col lg={7}>
              <h1>
                Share Your <span>Knowledge</span><br />
                Learn From Others
              </h1>
              <p>
                SkillBank connects learners and teachers in one platform where
                skills become currency and time becomes value.
              </p>
              <Button className="hero-btn">Get Started</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="section">
        <Container>
          <h2 className="section-title">Why Choose SkillBank?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-arrow-left-right"></i>
                </div>
                <h4>Skill Exchange</h4>
                <p>Teach what you know and learn what you need.</p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h4>Time Banking</h4>
                <p>Earn credits for every teaching hour you give.</p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h4>Community</h4>
                <p>Build strong learning connections worldwide.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ABOUT */}
      <section className="section about-section">
        <Container>
          <Row>
            <Col lg={6}>
              <h2>Build Your Future Through Skills</h2>
              <p>
                SkillBank creates a modern learning ecosystem where every user
                can become both a teacher and a learner.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <Container>
          <Row>
            <Col md={3}>
              <h5>SkillBank</h5>
              <p>
                A modern skill exchange platform where knowledge becomes value.
              </p>
            </Col>

            <Col md={3}>
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </Col>

            <Col md={3}>
              <h5>Support</h5>
              <a href="#">Help Center</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
            </Col>

            <Col md={3}>
              <h5>Follow Us</h5>
              <div className="social-icons">
                <a href="https://www.facebook.com/"><i className="bi bi-facebook"></i> Facebook</a>
                <a href="https://www.instagram.com/"><i className="bi bi-instagram"></i> Instagram</a>
                <a href="www.linkedin.com"><i className="bi bi-linkedin"></i> LinkedIn</a>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom">
            © 2026 SkillBank. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;