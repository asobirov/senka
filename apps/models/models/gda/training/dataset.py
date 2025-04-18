from datasets import load_dataset, concatenate_datasets, DatasetDict, Dataset

from ..utils.normalize_dataset import normalize_harpo, normalize_yang
from ..utils.instructions import format_instructions


harpo_dataset = load_dataset("harpomaxx/dga-detection")
yang_dataset = load_dataset("YangYang-Research/dga-detection")

harpo_normalized = harpo_dataset.map(normalize_harpo)
yang_normalized = yang_dataset.map(normalize_yang)

dataset: Dataset = concatenate_datasets([harpo_normalized, yang_normalized])

dataset_with_instructions = dataset.map(format_instructions)

dataset = dataset_with_instructions.train_test_split(test_size=0.2)
