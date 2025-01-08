#!/usr/bin/env bash

function main {
    echo "If you procees this will reset all bike trips data"
    echo "y | n"

    while read -r input;
    do
        case "$input" in 
          Y | y | Yes | yes)
              
            for target in ./trips/*.{json,csv}
            do
                rm "$target"
            done

            exit 0
        ;;

        N | n | No | no)
            echo "No, exiting"
            exit 0
        ;;

        *)
            echo "unkown command"
            exit 1
        ;;
        esac
    done
    exit 1
}


main "$@"