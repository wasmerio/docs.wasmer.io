import React from "react";
import styles from "./PullRequest.module.css";

type Props = {
    repository: string;
    number: number;
    name: string;
}

export default function PullRequest({ repository, number, name }: Props) {
    const text = `${repository}#${number}`;
    const link = `https://github.com/${repository}/pull/${number}`;

    return (
        <span title={name} className={styles.pr}>
            <a href={link} target="_blank">{text}</a>
        </span>
    )
}
