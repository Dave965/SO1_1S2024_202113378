#include <linux/module.h>

#include <linux/kernel.h>

#include <linux/mm.h>

#include <linux/init.h>

#include <linux/proc_fs.h>

#include <asm/uaccess.h>

#include <linux/seq_file.h>

#include <linux/fs.h>

#include <linux/sched/loadavg.h>


const long megabyte = 1024*1024;

struct sysinfo si;
struct task_struct *task;       
struct task_struct *task_child;
struct list_head *list;

static void init_meminfo(void){
	si_meminfo(&si);
}


MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de sistema, Laboratorio sistemas operativos 1");
MODULE_AUTHOR("Dave965");

static int escribir_archivo(struct seq_file *archivo, void *v){
	init_meminfo();

	seq_printf(archivo, "{ \"memoria_ocupada\": %lu, \"cpu_utilizado\": %lu.%02lu, \"procesos\": [", 100-((si_mem_available()*si.mem_unit/megabyte)*100/(si.totalram*si.mem_unit/megabyte)), LOAD_INT(avenrun[0]), LOAD_FRAC(avenrun[0]));
	
	int a=0;
	int b=0;
	
	for_each_process( task ){   
		if(a==0){
			a=1;
		}else{
			seq_printf(archivo, ",");
		}
		
		seq_printf(archivo, "{ \"nombre\": \"%s\", \"pid\": %d, \"hijos\": [", task->comm,task->pid);
		b=0;
		
        list_for_each(list, &task->children){
			if(b==0){
				b=1;
			}else{
				seq_printf(archivo, ",");
			}

            task_child = list_entry( list, struct task_struct, sibling ); 
            seq_printf(archivo, "%d", task_child->pid);
        }
        seq_printf(archivo, "]}");
    }
	seq_printf(archivo, "]}");
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
	proc_create("p1_202113378", 0, NULL, &operaciones);
	printk(KERN_INFO "202113378\n");
	return 0;
}

static void _remove(void){
	remove_proc_entry("p1_202113378", NULL);
	printk(KERN_INFO "Modulo de sistema, Laboratorio sistemas operativos 1\n");
}

module_init(_insert);
module_exit(_remove);

