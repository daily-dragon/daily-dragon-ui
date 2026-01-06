import {AddWordDialog} from "./AddWordDialog.jsx";
import {Spinner} from "@chakra-ui/react";
import {VocabularyList} from "./VocabularyList.jsx";
import {useEffect, useState} from "react";
import {fetchVocabulary} from "../../services/vocabularyService.js";

export default function VocabularyPage() {

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
            <AddWordDialog onAdd={refresh}/>
            {
                loadingVocabulary ? (<Spinner/>) :
                    (<VocabularyList items={items} onDelete={refresh}/>)
            }
        </>
    );
}
