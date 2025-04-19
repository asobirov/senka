from datasets import load_dataset, load_from_disk, concatenate_datasets, DatasetDict, Dataset
import os

from ..utils.normalize_dataset import normalize_harpo, normalize_yang
from ..utils.instructions import format_instructions

if os.path.exists("cached/dga_preprocessed_dataset"):
    dataset = load_from_disk("cached/dga_preprocessed_dataset")
else:
    harpo_train = load_dataset("harpomaxx/dga-detection", split="train")
    harpo_test = load_dataset("harpomaxx/dga-detection", split="test")

    # YangYang-Research/dga-detection only has the train split
    yang_full = load_dataset("YangYang-Research/dga-detection", split="train")
    yang_split = yang_full.train_test_split(test_size=0.1)
    yang_train = yang_split["train"]
    yang_test = yang_split["test"]

    harpo_train = harpo_train.map(normalize_harpo)
    harpo_test = harpo_test.map(normalize_harpo)
    yang_train = yang_train.map(normalize_yang)
    yang_test = yang_test.map(normalize_yang)

    train_dataset = concatenate_datasets([harpo_train, yang_train]).map(format_instructions)
    test_dataset = concatenate_datasets([harpo_test, yang_test]).map(format_instructions)

    dataset = DatasetDict({"train": train_dataset, "test": test_dataset})

    dataset.save_to_disk("cached/dga_preprocessed_dataset")

