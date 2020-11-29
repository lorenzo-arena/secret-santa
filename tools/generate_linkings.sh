#!/bin/bash

# Clear current db
heroku pg:psql -c "delete from linkings"

PEOPLE=("lorenzo" "teresa" "samuele" "costanza" "marta" "francesco" "tommaso" "luca" "chiara")
LINKED_PEOPLE=()

for PERSON in "${PEOPLE[@]}";
do
    LINKED=0
    LINK=""
    while [ $LINKED -ne 1 ];
    do
        LINK=${PEOPLE[$RANDOM % ${#PEOPLE[@]} ]}
        
        if [ "$PERSON" = "$LINK" ]; then
            #echo "Choosed same person."
            LINKED=0
        else
            if [[ " ${LINKED_PEOPLE[@]} " =~ " ${LINK} " ]]; then
                #echo "Person already choosed."
                LINKED=0
            else
                # Great!
                LINKED=1
                LINKED_PEOPLE+=($LINK)
                #echo "$PERSON $LINK"
            fi
        fi
    done
done

INDEX=0
for PERSON in "${PEOPLE[@]}";
do
    #echo "Person: $PERSON Link: ${LINKED_PEOPLE[$INDEX]}"
    heroku pg:psql -c "insert into linkings values ($INDEX, '$PERSON', '${LINKED_PEOPLE[$INDEX]}', false);"

    INDEX=${INDEX}+1
done