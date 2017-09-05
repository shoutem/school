
export const updateCommitment = ({ commitment, remindAt, id }) => ({
    type: "updateCommitment",
    commitment,
    remindAt,
    id
});

export const doneCommitment = ({ id }) => ({
    type: "doneCommitment",
    id
});
