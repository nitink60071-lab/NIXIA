
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Code2,
  ArrowLeft,
  Save,
  LoaderCircle,
  Sparkles
} from "lucide-react";

import "./Profile.css";

const Profile = ({ onBack }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: [],
    bio: ""
  });

  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        const user = data.profile;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          college: user.college || "",
          degree: user.degree || "",
          branch: user.branch || "",
          graduationYear: user.graduationYear || "",
          skills: user.skills || [],
          bio: user.bio || ""
        });

        setSkillsText((user.skills || []).join(", "));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const skills = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            college: profile.college,
            degree: profile.degree,
            branch: profile.branch,
            graduationYear: profile.graduationYear
              ? Number(profile.graduationYear)
              : null,
            skills,
            bio: profile.bio
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setProfile((prev) => ({
        ...prev,
        ...data.profile
      }));

      setSkillsText(skills.join(", "));
      setMessage("Profile updated successfully!");

      // redirect to Dashboard after successful save
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <LoaderCircle className="profile-spinner" size={32} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          className="profile-back"
          onClick={() => onBack ? onBack() : navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="profile-heading">
          <div className="profile-heading-icon">
            <User size={25} />
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and academic information.</p>
          </div>
        </div>
      </header>

      <form className="profile-form" onSubmit={handleSave}>
        <section className="profile-card">
          <div className="profile-card-heading">
            <Sparkles size={19} />
            <h2>Personal Information</h2>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-input-wrap">
                <User size={18} />
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <div className="profile-input-wrap">
                <Mail size={18} />
                <input
                  value={profile.email}
                  readOnly
                  className="profile-readonly"
                />
              </div>
            </div>
          </div>

          <div className="profile-field profile-bio-field">
            <label>About Me</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Write a short introduction about yourself..."
              rows={4}
            />
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-heading">
            <GraduationCap size={20} />
            <h2>Academic Information</h2>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>College / University</label>
              <div className="profile-input-wrap">
                <Building2 size={18} />
                <input
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Degree</label>
              <div className="profile-input-wrap">
                <BookOpen size={18} />
                <input
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech"
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Branch</label>
              <div className="profile-input-wrap">
                <Code2 size={18} />
                <input
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Graduation Year</label>
              <div className="profile-input-wrap">
                <Calendar size={18} />
                <input
                  type="number"
                  name="graduationYear"
                  value={profile.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-heading">
            <Code2 size={20} />
            <h2>Skills & Expertise</h2>
          </div>

          <div className="profile-field">
            <label>Your Skills</label>
            <textarea
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Python, Java, React, SQL..."
              rows={3}
            />
            <small>Separate multiple skills using commas.</small>
          </div>
        </section>

        {message && (
          <div className="profile-success">{message}</div>
        )}

        {error && (
          <div className="profile-error">{error}</div>
        )}

        <button
          type="submit"
          className="profile-save-btn"
          disabled={saving}
        >
          {saving ? (
            <>
              <LoaderCircle className="profile-spinner" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
