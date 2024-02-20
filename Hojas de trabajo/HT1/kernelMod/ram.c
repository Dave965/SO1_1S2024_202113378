#include <linux/module.h>

#include <linux/kernel.h>

#include <linux/mm.h>

#include <linux/init.h>

#include <linux/proc_fs.h>

#include <asm/uaccess.h>

#include <linux/seq_file.h>

const long megabyte = 1024*1024;

struct sysinfo si;

static void init_meminfo(void){
	si_meminfo(&si);
}


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de ram, Laboratorio sistemas operativos 1");
MODULE_AUTHOR("Dave965");

static int escribir_archivo(struct seq_file *archivo, void *v){
	init_meminfo();
	seq_printf(archivo, "%lu|", (si.totalram*si.mem_unit/megabyte));
	seq_printf(archivo, "%lu", (si.freeram*si.mem_unit/megabyte));
	return 0;
}

static int al_abrir(struct inode *inode, struct file *file){
	return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones = {
	.proc_open = al_abrir,
	.proc_read = seq_read
};

static int _insert(void){
	proc_create("ram_202113378", 0, NULL, &operaciones);
	printk(KERN_INFO "202113378\n");
	return 0;
}

static void _remove(void){
	remove_proc_entry("ram_202113378", NULL);
	printk(KERN_INFO "Laboratorio sistemas operativos 1\n");
}

module_init(_insert);
module_exit(_remove);

