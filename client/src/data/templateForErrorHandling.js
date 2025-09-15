/*
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null); // Clear previous errors
  try {
    const response = await axios.get("/some-api-endpoint");
    setData(response.data);
  } catch (err) {
    console.error("Failed to fetch data:", err);
    setError(err); // Set the error state
    setData(null); // Clear data on error
  } finally {
    setLoading(false); // Always set loading to false
  }
}, []);

// In your component's JSX:
if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
// ... render data *}
*/
