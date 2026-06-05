import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function About() {
  return (
    <div className="about-page">
      <style>{`
        .about-page{
          min-height:100vh;
          color:white;
          font-family:'Poppins',sans-serif;
          background:
            linear-gradient(rgba(2,6,23,0.82), rgba(2,6,23,0.88)),
            url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f");
          background-size:cover;
          background-position:center;
          background-attachment:fixed;
        }

        /* HERO */
        .about-hero{
          padding:120px 0 80px;
          text-align:center;
        }

        .about-hero h1{
          font-size:3.2rem;
          font-weight:700;
        }

        .about-hero span{
          color:#38bdf8;
        }

        .about-hero p{
          max-width:750px;
          margin:20px auto 0;
          color:#e2e8f0;
          font-size:17px;
          line-height:1.8;
        }

        /* CONTENT */
        .about-section{
          padding:40px 0 90px;
        }

        .about-card{
          background:rgba(255,255,255,0.08);
          border:none;
          border-radius:20px;
          padding:35px;
          backdrop-filter:blur(10px);
          color:white;
          height:100%;
        }

        .about-card h4{
          margin-bottom:15px;
          font-weight:600;
        }

        .about-card p{
          color:#cbd5e1;
          line-height:1.8;
          margin-bottom:0;
        }

        .icon-box{
          width:60px;
          height:60px;
          border-radius:15px;
          background:rgba(56,189,248,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#38bdf8;
          font-size:24px;
          margin-bottom:18px;
        }

        /* FOOTER */
        .footer{
          text-align:center;
          padding:25px;
          color:#cbd5e1;
          border-top:1px solid rgba(255,255,255,0.08);
          background:rgba(0,0,0,0.25);
        }

        @media(max-width:768px){
          .about-hero h1{
            font-size:2.3rem;
          }

          .about-card{
            padding:25px;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="about-hero">
        <Container>
          <h1>About <span>SkillBank</span></h1>
          <p>
            SkillBank is a modern platform where people can share their skills,
            connect with others, and learn in a collaborative environment that
            values knowledge over money.
          </p>
        </Container>
      </section>

      {/* CONTENT */}
      <section className="about-section">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="about-card">
                <div className="icon-box">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <h4>Our Vision</h4>
                <p>
                  We aim to build a platform where anyone can teach what they
                  know and learn what they need from others.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="about-card">
                <div className="icon-box">
                  <i className="bi bi-people"></i>
                </div>
                <h4>Our Community</h4>
                <p>
                  SkillBank creates a supportive learning community where users
                  help each other grow personally and professionally.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="about-card">
                <div className="icon-box">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4>Our Promise</h4>
                <p>
                  We focus on trust, accessibility, and quality to provide a
                  better experience for every learner and teacher.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 SkillBank • Empowering Skill Sharing
      </footer>
    </div>
  );
}

export default About;