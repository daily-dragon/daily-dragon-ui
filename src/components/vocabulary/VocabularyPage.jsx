import {AddWordDialog} from "./AddWordDialog.jsx";
import {Spinner, Button} from "@chakra-ui/react";
import {VocabularyList} from "./VocabularyList.jsx";
import {useEffect, useState} from "react";
import {fetchVocabulary} from "../../services/vocabularyService.js";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";

export default function VocabularyPage() {

    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loadingVocabulary, setLoadingVocabulary] = useState(true);

    const refresh = () => {
        fetchVocabulary()
            .then(vocabulary => {
                setItems(vocabulary);
                setLoadingVocabulary(false);
            })
            .catch(err => {
                // Handle error (show message, etc.)
                console.error(err);
            });
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}><FiArrowLeft/> Home</Button>
            <AddWordDialog onAdd={refresh}/>
            {
                loadingVocabulary ? (<Spinner/>) :
                    (<VocabularyList items={items} onDelete={refresh}/>)
            }
        </>
    );
}
