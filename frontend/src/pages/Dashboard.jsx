import { useEffect, useRef, useState } from "react";

function Dashboard({ setScreen }) {
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const emptyPlaceForm = {
    name: "",
    description: "",
    location: "",
    category: "general",
    lat: "",
    lng: "",
    blockName: "",
    floor: "",
    cabinNumber: "",
  };

  const [newPlace, setNewPlace] = useState(emptyPlaceForm);
  const [editPlace, setEditPlace] = useState(emptyPlaceForm);

  const [addMessage, setAddMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const mapSectionRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setScreen("login");
      return;
    }

    setPlacesLoading(true);

    fetch("http://localhost:3000/api/places")
      .then((res) => res.json())
      .then((data) => {
        const finalPlaces = Array.isArray(data) ? data : data.places || [];
        setPlaces(finalPlaces);
        if (finalPlaces.length > 0) {
          setSelectedPlace(finalPlaces[0]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setPlacesLoading(false));
  }, [token, setScreen]);

  const filteredPlaces = places.filter((place) => {
    const q = search.toLowerCase();
    const matchesSearch =
      place.name?.toLowerCase().includes(q) ||
      place.description?.toLowerCase().includes(q) ||
      place.location?.toLowerCase().includes(q) ||
      place.blockName?.toLowerCase().includes(q) ||
      place.floor?.toLowerCase().includes(q) ||
      place.cabinNumber?.toLowerCase().includes(q);

    const matchesCategory =
      category === "all" ||
      place.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const mapSrc =
    selectedPlace?.lat && selectedPlace?.lng
      ? `https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&output=embed`
      : selectedPlace
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          selectedPlace.location || selectedPlace.name
        )}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent("SRM University AP")}&output=embed`;

  const facultyFieldsVisible = newPlace.category === "faculty";
  const facultyEditVisible = editPlace.category === "faculty";

  const adminStats = {
    faculty: places.filter((p) => p.category === "faculty").length,
    hostels: places.filter((p) => p.category === "hostel").length,
    canteens: places.filter((p) => p.category === "canteen").length,
  };

  const handleAddPlace = async () => {
    if (userRole !== "admin") {
      setAddMessage("Only admin can add places");
      return;
    }

    if (
      !newPlace.name ||
      !newPlace.description ||
      !newPlace.location ||
      newPlace.lat === "" ||
      newPlace.lng === ""
    ) {
      setAddMessage("Name, description, location, latitude and longitude are required");
      return;
    }

    try {
      setAddLoading(true);
      setAddMessage("");

      const payload = {
        ...newPlace,
        lat: Number(newPlace.lat),
        lng: Number(newPlace.lng),
      };

      const res = await fetch("http://localhost:3000/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddMessage(data.message || "Failed to add place");
        return;
      }

      setPlaces((prev) => [data, ...prev]);
      setSelectedPlace(data);
      setNewPlace(emptyPlaceForm);
      setShowAddForm(false);
    } catch {
      setAddMessage("Something went wrong");
    } finally {
      setAddLoading(false);
    }
  };

  const openEditForm = (place) => {
    setEditPlace({
      name: place.name || "",
      description: place.description || "",
      location: place.location || "",
      category: place.category || "general",
      lat: place.lat ?? "",
      lng: place.lng ?? "",
      blockName: place.blockName || "",
      floor: place.floor || "",
      cabinNumber: place.cabinNumber || "",
      _id: place._id,
    });
    setEditMessage("");
    setShowEditForm(true);
  };

  const handleEditPlace = async () => {
    if (userRole !== "admin") {
      setEditMessage("Only admin can edit places");
      return;
    }

    if (
      !editPlace.name ||
      !editPlace.description ||
      !editPlace.location ||
      editPlace.lat === "" ||
      editPlace.lng === ""
    ) {
      setEditMessage("Name, description, location, latitude and longitude are required");
      return;
    }

    try {
      setEditLoading(true);
      setEditMessage("");

      const payload = {
        ...editPlace,
        lat: Number(editPlace.lat),
        lng: Number(editPlace.lng),
      };

      const res = await fetch(`http://localhost:3000/api/places/${editPlace._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setEditMessage(data.message || "Failed to update place");
        return;
      }

      setPlaces((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setSelectedPlace(data);
      setShowEditForm(false);
    } catch {
      setEditMessage("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (userRole !== "admin") return;

    const confirmed = window.confirm("Are you sure you want to delete this place?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/places/${placeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteMessage(data.message || "Failed to delete place");
        return;
      }

      const updatedPlaces = places.filter((place) => place._id !== placeId);
      setPlaces(updatedPlaces);
      setDeleteMessage("Place deleted successfully");

      if (selectedPlace?._id === placeId) {
        setSelectedPlace(updatedPlaces[0] || null);
      }
    } catch {
      setDeleteMessage("Something went wrong while deleting");
    }
  };

  const focusMap = (place) => {
    setSelectedPlace(place);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid #e2e8f0",
          padding: "20px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "30px", fontWeight: "800", letterSpacing: "-0.8px" }}>
            Campus Dashboard
          </h1>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#64748b" }}>
            {userName ? `Welcome, ${userName} (${userRole || "student"})` : "Campus place explorer"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {userRole === "admin" && (
            <button onClick={() => setShowAddForm(true)} style={purpleBtn}>
              Add Place
            </button>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              localStorage.removeItem("userRole");
              setScreen("landing");
            }}
            style={whiteBtn}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "34px 24px 50px 24px" }}>
        <div style={panelStyle}>
          <h2 style={sectionTitle}>Search & Filter</h2>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <input
              type="text"
              placeholder="Search by place name, description, location, block, floor or cabin"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Categories</option>
              <option value="canteen">Canteen</option>
              <option value="hostel">Hostel</option>
              <option value="classroom">Classroom</option>
              <option value="library">Library</option>
              <option value="lab">Lab</option>
              <option value="faculty">Faculty</option>
              <option value="restaurant">Restaurant</option>
              <option value="elevator">Elevator</option>
              <option value="stairs">Stairs</option>
              <option value="office">Office</option>
              <option value="medical">Medical</option>
              <option value="washroom">Washroom</option>
              <option value="parking">Parking</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {deleteMessage && <MessageBox text={deleteMessage} success />}

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "22px", alignItems: "start" }}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "24px" }}>
              {[
                ["Total Places", places.length],
                ["Filtered Results", filteredPlaces.length],
                ["Active Category", category.charAt(0).toUpperCase() + category.slice(1)],
              ].map(([title, value]) => (
                <StatCard key={title} title={title} value={value} />
              ))}
            </div>

            {userRole === "admin" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "24px" }}>
                <StatCard title="Faculty Rooms" value={adminStats.faculty} />
                <StatCard title="Hostels" value={adminStats.hostels} />
                <StatCard title="Canteens" value={adminStats.canteens} />
              </div>
            )}

            <h2 style={{ margin: "0 0 18px 0", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.6px" }}>
              Places
            </h2>

            {placesLoading ? (
              <div style={emptyStateStyle}>Loading places...</div>
            ) : filteredPlaces.length === 0 ? (
              <div style={emptyStateStyle}>No places found for the selected search or category.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "18px" }}>
                {filteredPlaces.map((place) => {
                  const isSelected = selectedPlace?._id === place._id;

                  return (
                    <div
                      key={place._id}
                      onClick={() => setSelectedPlace(place)}
                      style={{
                        background: "#ffffff",
                        border: isSelected ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                        borderRadius: "24px",
                        padding: "24px",
                        boxShadow: isSelected
                          ? "0 18px 40px rgba(124, 58, 237, 0.12)"
                          : "0 14px 36px rgba(15, 23, 42, 0.05)",
                        transition: "0.22s ease",
                        cursor: "pointer",
                      }}
                    >
                      <div style={badgeStyle}>{place.category || "general"}</div>

                      <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
                        {place.name}
                      </h3>

                      <p style={{ margin: "0 0 14px 0", color: "#475569", lineHeight: "1.7", fontSize: "15px" }}>
                        {place.description}
                      </p>

                      <p style={metaText}>📍 {place.location}</p>
                      {place.blockName ? <p style={metaText}>🏢 Block: {place.blockName}</p> : null}
                      {place.floor ? <p style={metaText}>🛗 Floor: {place.floor}</p> : null}
                      {place.cabinNumber ? <p style={metaText}>🚪 Cabin: {place.cabinNumber}</p> : null}
                      <p style={{ ...metaText, marginBottom: "16px" }}>
                        🌐 Coordinates: {place.lat}, {place.lng}
                      </p>

                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            focusMap(place);
                          }}
                          style={darkBtn}
                        >
                          View on Map
                        </button>

                        <a
                          href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          style={linkBtn}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open Directions
                        </a>

                        {userRole === "admin" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditForm(place);
                              }}
                              style={editBtn}
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlace(place._id);
                              }}
                              style={deleteBtn}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div ref={mapSectionRef} style={{ position: "sticky", top: "110px" }}>
            <div style={panelStyle}>
              <h3 style={sectionTitle}>Map Preview</h3>

              <div
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  height: "360px",
                  marginBottom: "18px",
                }}
              >
                <iframe
                  title="Campus Map"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  loading="lazy"
                />
              </div>

              {selectedPlace && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "18px",
                  }}
                >
                  <div style={badgeStyle}>Selected Place</div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "800" }}>
                    {selectedPlace.name}
                  </h4>
                  <p style={{ margin: "0 0 10px 0", color: "#475569", lineHeight: "1.7", fontSize: "14px" }}>
                    {selectedPlace.description}
                  </p>
                  <p style={metaText}>📍 {selectedPlace.location}</p>
                  {selectedPlace.blockName ? <p style={metaText}>🏢 Block: {selectedPlace.blockName}</p> : null}
                  {selectedPlace.floor ? <p style={metaText}>🛗 Floor: {selectedPlace.floor}</p> : null}
                  {selectedPlace.cabinNumber ? <p style={metaText}>🚪 Cabin: {selectedPlace.cabinNumber}</p> : null}
                  <p style={{ ...metaText, marginBottom: "16px" }}>
                    🌐 Coordinates: {selectedPlace.lat}, {selectedPlace.lng}
                  </p>

                  <a
                    href={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={purpleLinkBtn}
                  >
                    Navigate Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddForm && userRole === "admin" && (
        <Modal
          title="Add New Place"
          subtitle="Add a new campus location to the system. Latitude and longitude are mandatory."
          message={addMessage}
          onClose={() => {
            setShowAddForm(false);
            setAddMessage("");
          }}
          onSubmit={handleAddPlace}
          submitLabel={addLoading ? "Adding..." : "Add Place"}
        >
          <input
            type="text"
            placeholder="Place name"
            value={newPlace.name}
            onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="text"
            placeholder="Description"
            value={newPlace.description}
            onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="text"
            placeholder="Location"
            value={newPlace.location}
            onChange={(e) => setNewPlace({ ...newPlace, location: e.target.value })}
            style={modalInputStyle}
          />
          <select
            value={newPlace.category}
            onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
            style={modalInputStyle}
          >
            <option value="general">General</option>
            <option value="canteen">Canteen</option>
            <option value="hostel">Hostel</option>
            <option value="classroom">Classroom</option>
            <option value="library">Library</option>
            <option value="lab">Lab</option>
            <option value="faculty">Faculty</option>
            <option value="restaurant">Restaurant</option>
            <option value="elevator">Elevator</option>
            <option value="stairs">Stairs</option>
            <option value="office">Office</option>
            <option value="medical">Medical</option>
            <option value="washroom">Washroom</option>
            <option value="parking">Parking</option>
          </select>
          <input
            type="number"
            placeholder="Latitude (mandatory)"
            value={newPlace.lat}
            onChange={(e) => setNewPlace({ ...newPlace, lat: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="number"
            placeholder="Longitude (mandatory)"
            value={newPlace.lng}
            onChange={(e) => setNewPlace({ ...newPlace, lng: e.target.value })}
            style={modalInputStyle}
          />

          {facultyFieldsVisible && (
            <>
              <input
                type="text"
                placeholder="Block name"
                value={newPlace.blockName}
                onChange={(e) => setNewPlace({ ...newPlace, blockName: e.target.value })}
                style={modalInputStyle}
              />
              <input
                type="text"
                placeholder="Floor"
                value={newPlace.floor}
                onChange={(e) => setNewPlace({ ...newPlace, floor: e.target.value })}
                style={modalInputStyle}
              />
              <input
                type="text"
                placeholder="Cabin number"
                value={newPlace.cabinNumber}
                onChange={(e) => setNewPlace({ ...newPlace, cabinNumber: e.target.value })}
                style={modalInputStyle}
              />
            </>
          )}
        </Modal>
      )}

      {showEditForm && userRole === "admin" && (
        <Modal
          title="Edit Place"
          subtitle="Update the selected campus location."
          message={editMessage}
          onClose={() => {
            setShowEditForm(false);
            setEditMessage("");
          }}
          onSubmit={handleEditPlace}
          submitLabel={editLoading ? "Updating..." : "Update Place"}
        >
          <input
            type="text"
            placeholder="Place name"
            value={editPlace.name}
            onChange={(e) => setEditPlace({ ...editPlace, name: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="text"
            placeholder="Description"
            value={editPlace.description}
            onChange={(e) => setEditPlace({ ...editPlace, description: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="text"
            placeholder="Location"
            value={editPlace.location}
            onChange={(e) => setEditPlace({ ...editPlace, location: e.target.value })}
            style={modalInputStyle}
          />
          <select
            value={editPlace.category}
            onChange={(e) => setEditPlace({ ...editPlace, category: e.target.value })}
            style={modalInputStyle}
          >
            <option value="general">General</option>
            <option value="canteen">Canteen</option>
            <option value="hostel">Hostel</option>
            <option value="classroom">Classroom</option>
            <option value="library">Library</option>
            <option value="lab">Lab</option>
            <option value="faculty">Faculty</option>
            <option value="restaurant">Restaurant</option>
            <option value="elevator">Elevator</option>
            <option value="stairs">Stairs</option>
            <option value="office">Office</option>
            <option value="medical">Medical</option>
            <option value="washroom">Washroom</option>
            <option value="parking">Parking</option>
          </select>
          <input
            type="number"
            placeholder="Latitude"
            value={editPlace.lat}
            onChange={(e) => setEditPlace({ ...editPlace, lat: e.target.value })}
            style={modalInputStyle}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={editPlace.lng}
            onChange={(e) => setEditPlace({ ...editPlace, lng: e.target.value })}
            style={modalInputStyle}
          />

          {facultyEditVisible && (
            <>
              <input
                type="text"
                placeholder="Block name"
                value={editPlace.blockName}
                onChange={(e) => setEditPlace({ ...editPlace, blockName: e.target.value })}
                style={modalInputStyle}
              />
              <input
                type="text"
                placeholder="Floor"
                value={editPlace.floor}
                onChange={(e) => setEditPlace({ ...editPlace, floor: e.target.value })}
                style={modalInputStyle}
              />
              <input
                type="text"
                placeholder="Cabin number"
                value={editPlace.cabinNumber}
                onChange={(e) => setEditPlace({ ...editPlace, cabinNumber: e.target.value })}
                style={modalInputStyle}
              />
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{title}</p>
      <h3 style={{ margin: "10px 0 0 0", fontSize: "30px", fontWeight: "800", letterSpacing: "-0.8px" }}>
        {value}
      </h3>
    </div>
  );
}

function MessageBox({ text, success }) {
  return (
    <div
      style={{
        marginBottom: "18px",
        padding: "14px 16px",
        borderRadius: "14px",
        background: success ? "#ecfdf5" : "#fef2f2",
        border: success ? "1px solid #a7f3d0" : "1px solid #fecaca",
        color: success ? "#065f46" : "#b91c1c",
        fontWeight: "600",
      }}
    >
      {text}
    </div>
  );
}

function Modal({ title, subtitle, children, message, onClose, onSubmit, submitLabel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "30px",
          boxShadow: "0 30px 70px rgba(15, 23, 42, 0.16)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.8px" }}>
          {title}
        </h2>

        <p style={{ margin: "0 0 22px 0", color: "#64748b", fontSize: "15px", lineHeight: "1.7" }}>
          {subtitle}
        </p>

        {children}

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button onClick={onClose} style={{ ...whiteBtn, flex: 1 }}>
            Cancel
          </button>

          <button onClick={onSubmit} style={{ ...purpleBtn, flex: 1 }}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "26px",
  padding: "18px",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
};

const sectionTitle = {
  margin: "0 0 14px 0",
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
};

const inputStyle = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const modalInputStyle = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: "16px",
};

const badgeStyle = {
  display: "inline-block",
  padding: "7px 13px",
  borderRadius: "999px",
  background: "#ede9fe",
  color: "#6d28d9",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "capitalize",
  marginBottom: "14px",
};

const metaText = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "14px",
};

const purpleBtn = {
  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
  border: "none",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(124, 58, 237, 0.18)",
};

const whiteBtn = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
};

const darkBtn = {
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
};

const linkBtn = {
  display: "inline-block",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
};

const purpleLinkBtn = {
  display: "inline-block",
  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  boxShadow: "0 12px 28px rgba(124, 58, 237, 0.22)",
};

const editBtn = {
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#fee2e2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "12px 18px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

const emptyStateStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  padding: "42px",
  textAlign: "center",
  color: "#64748b",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
};

export default Dashboard;